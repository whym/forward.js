app := "forward"

check:
	npm run typecheck
	npm test
	npm audit
run:
	npm install
	npm start
run-container:
	podman build -t {{app}} . && podman run -it -p 3000:3000 -e FORWARD_CONFIG='{rules: {"*": "https://example.com/forwarded"}}' {{app}}
