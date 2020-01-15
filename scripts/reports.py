import json
import os

with open('saas2000.json') as json_file:
    data = json.load(json_file)


def create_report(name, url, form):
  os.system(f"lighthouse {url} --output=json --output-path='./reports/{name}-{form}.json' --config-path=./{form}-config --quiet")


for p in range(0, len(data)):
    c = data[p]
    print(c['name'], c['rank'])

    name = ('-').join(c['name'].split(' '))
    if c['name'] == name:
        continue
    create_report(c['name'], c['url'], 'desktop')
    create_report(c['name'], c['url'], 'mobile')


# os.system("lighthouse https://versoly.com --output=json --output-path=./reports/report.json --config-path=./desktop-config")
