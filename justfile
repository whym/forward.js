app := "forward"

test:
	npm test
run:
	npm start
run-docker:
	podman build -t {{app}} . && podman run -it -p 3000:3000 -e FORWARD_CONFIG='{rules: {"*": "https://example.com/forwarded"}}' {{app}}
