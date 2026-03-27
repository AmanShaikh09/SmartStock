# SmartStock

This is my Smart Stock Inventory Management project.

## Access from GitHub

You can access the project on GitHub or clone it locally:

```bash
git clone https://github.com/AmanShaikh09/SmartStock.git
```

## Setup Step By Step

Prerequisites:
- Node.js (LTS)
- Python 3.10+
- MongoDB (local or cloud)

1. Clone the repo:
```bash
git clone https://github.com/AmanShaikh09/SmartStock.git
cd SmartStock
```

2. Backend setup:
```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

3. Start MongoDB (make sure it is running locally or update `MONGO_URL` in `.env`).

4. Run the backend API:
```bash
python main.py
```
The API runs on `http://127.0.0.1:5001`.

5. Frontend setup (new terminal):
```bash
cd frontend
npm install
npm run dev
```
The frontend runs on `http://localhost:5173`.
