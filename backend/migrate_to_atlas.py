from pymongo import MongoClient
import os
import sys

def migrate_database(local_uri, atlas_uri, db_name):
    print(f"Connecting to local MongoDB: {local_uri}")
    local_client = MongoClient(local_uri)
    local_db = local_client[db_name]

    print(f"Connecting to Atlas MongoDB...")
    try:
        atlas_client = MongoClient(atlas_uri)
        # Test connection
        atlas_client.admin.command('ping')
        print("Connected to Atlas MongoDB successfully.")
    except Exception as e:
        print(f"Failed to connect to Atlas: {e}")
        sys.exit(1)

    atlas_db = atlas_client[db_name]

    collections = local_db.list_collection_names()
    print(f"Found collections to migrate: {collections}")

    for coll_name in collections:
        print(f"\nMigrating collection: {coll_name}")
        local_collection = local_db[coll_name]
        atlas_collection = atlas_db[coll_name]

        # Get all documents
        documents = list(local_collection.find({}))
        
        if len(documents) == 0:
            print(f"Collection {coll_name} is empty. Skipping.")
            continue

        print(f"Found {len(documents)} documents in local collection.")
        
        try:
            # Clear existing data in Atlas for this collection to avoid duplication if run multiple times
            # atlas_collection.delete_many({}) # Uncomment if you want to overwrite
            
            # Insert we can use insert_many but we should handle duplicate _id
            inserted = 0
            for doc in documents:
                try:
                    atlas_collection.insert_one(doc)
                    inserted += 1
                except Exception as e:
                    # Document might already exist
                    pass
            print(f"Successfully inserted {inserted} documents into Atlas {coll_name}.")
        except Exception as e:
            print(f"Error migrating collection {coll_name}: {e}")

    print("\nMigration completed!")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Migrate MongoDB from local to Atlas.')
    parser.add_argument('--atlas-uri', required=True, help='MongoDB Atlas Connection URI')
    parser.add_argument('--local-uri', default='mongodb://localhost:27017', help='Local MongoDB URI')
    parser.add_argument('--db-name', default='smartstock_db', help='Database Name')

    args = parser.parse_args()
    migrate_database(args.local_uri, args.atlas_uri, args.db_name)
    
