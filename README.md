# Deploy AML GitHub Action

Deploy AML Project with GitHub Action

Example usage

```yml
name: Deploy AML

on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master
    types:
      - closed

jobs:
  deploy-aml:
    if: github.event.pull_request.merged == true || github.event_name == 'push'
    runs-on: ubuntu-latest

    # API Key and Holistics Host
    env:
      HOLISTICS_API_KEY: ${{ secrets.HOLISTICS_API_KEY }}
      HOLISTICS_HOST: 'https://secure.holistics.io'

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Deploy AML # run deployment
        uses: holistics/deploy-aml@v1.0
```
