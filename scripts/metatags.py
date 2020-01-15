import json
# import os
import requests
from bs4 import BeautifulSoup


headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}

fb_props = ['og:title', 'og:description', 'og:image']

tw_props = ['twitter:title', 'twitter:description', 'twitter:image']


with open('sites_meta.json') as json_file:
    data = json.load(json_file)


for site in data:
    print(site['url'])
    r = requests.get(site['url'], headers=headers)
    c = r.content
    soup = BeautifulSoup(c, features="html.parser")
    # print(soup)
    print(soup.find('title').string)

    desc = soup.find("meta", attrs={"name": "description"})
    description = None
    if desc:
        description = desc.get("content")

    site['metatags'] = {
        'title': soup.find('title').string,
        'description': description
    }
    for prop in fb_props:
        p = soup.find("meta", property=prop)
        site['metatags'][prop] = None
        if p:
            site['metatags'][prop] = p.get("content")

    for prop in tw_props:
        p = soup.find("meta", attrs={"name": prop})
        site['metatags'][prop] = None
        if p:
            site['metatags'][prop] = p.get("content")

    # print(site['metatags']['og:title'])

    with open('sites_meta.json', 'w') as outfile:
        json.dump(data, outfile, indent=2)
