cd D:\Workspace\Go\new-api-customize
$env:NODE_TYPE="slave"
$env:FRONTEND_BASE_URL="http://localhost:3002"
go run main.go


cd /mnt/d/Workspace/Go/new-api-customize/web-customize
bun install
bun run dev -- --port 3002