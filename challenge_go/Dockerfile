FROM golang:1.19.4 AS builder

WORKDIR /app

COPY ./src .

RUN go build -o /app/build/

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/build/ .

ENTRYPOINT ["./challenge_go"]
