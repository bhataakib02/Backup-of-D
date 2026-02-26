FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install -y nodejs npm
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5000
CMD ["python", "scripts/web_dashboard.py"]