# cliq-notify
A custom github action to send messages and files to **zoho cliq**

---

## Inputs

| Input | Description | Required |
|-------|-------------|----------|
| `cliq-url` | The Zoho Cliq webhook URL |  Yes |
| `message` | Message text to send |  No |
| `file` | Path to a file containing message text | No |

If both `message` and `file` are provided, the file content will be used instead of the text input.

---

##  Outputs

| Output | Description |
|--------|-------------|
| `ok` | `true` if the request completed without errors |

---

## Example Usage

### Send message

```yaml
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      - name: notify build pipeline success
        uses: cokerrd/zoho-cliq-notification@v1
        with:
          cliq-url: ${{ secrets.CLIQ_URL }}
          message: "Pipeline complete!"
```

---

###  Send file

```yaml
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      - name: Send vulnerability report
        uses: cokerrd/cliq-notify@v1
        with:
          cliq-url: ${{ secrets.CLIQ_URL }}
          file: ./reports/vuln.txt
```
---


## Contributing


All contributions are encouraged! Check out the [contributor's guide](.github/CONTRIBUTING.md) for more info :>

---

## 📝 License

This project is licensed under the [MIT license](./LICENSE) .

