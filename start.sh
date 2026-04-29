#!/bin/bash

# MoAPI start/stop script
# Usage: ./start.sh          — 后台启动
#        ./start.sh stop     — 停止
#        ./start.sh restart  — 重启
#        ./start.sh status   — 查看状态

APP_NAME="new-api"
APP_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_FILE="$APP_DIR/$APP_NAME.log"
PID_FILE="$APP_DIR/$APP_NAME.pid"

start() {
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
        echo "[!] $APP_NAME is already running (PID: $(cat "$PID_FILE"))"
        exit 1
    fi

    cd "$APP_DIR"
    nohup "$APP_DIR/$APP_NAME" >> "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"

    sleep 1
    if kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
        echo "[√] $APP_NAME started in background (PID: $(cat "$PID_FILE"))"
        echo "    Log: $LOG_FILE"
    else
        echo "[×] $APP_NAME failed to start, check log: $LOG_FILE"
        rm -f "$PID_FILE"
        exit 1
    fi
}

stop() {
    if [ ! -f "$PID_FILE" ]; then
        echo "[!] PID file not found, try: pkill $APP_NAME"
        exit 1
    fi

    PID=$(cat "$PID_FILE")
    if kill -0 "$PID" 2>/dev/null; then
        kill "$PID"
        sleep 1
        if kill -0 "$PID" 2>/dev/null; then
            kill -9 "$PID"
        fi
        echo "[√] $APP_NAME stopped (PID: $PID)"
    else
        echo "[!] Process not running, cleaning PID file"
    fi
    rm -f "$PID_FILE"
}

status() {
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
        echo "[√] $APP_NAME is running (PID: $(cat "$PID_FILE"))"
    else
        echo "[×] $APP_NAME is not running"
    fi
}

case "${1:-start}" in
    start)   start ;;
    stop)    stop ;;
    restart) stop; sleep 1; start ;;
    status)  status ;;
    *)       echo "Usage: $0 {start|stop|restart|status}" ;;
esac
