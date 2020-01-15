import json
# import os
import requests

PAGESPEED_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'


def get_score(request):
    return request.json()
    return request.json()['lighthouseResult']['categories']['performance']['score']


with open('saas2000.json') as json_file:
    data = json.load(json_file)


for site in data[1:2]:
    print(site['url'])
    payload = {'url': site['url']}

    r = requests.get(PAGESPEED_URL, params=payload)
    performance = get_score(r)

    # mobile
    payload['strategy'] = 'mobile'
    r = requests.get(PAGESPEED_URL, params=payload)
    mobile_performance = get_score(r)

    site['performance'] = {
        'desktop': performance,
        'mobile': mobile_performance
    }
    print(site['performance'])

    with open('saas2000-21-10-2019.json', 'w') as outfile:
        json.dump(mobile_performance, outfile, indent=2)

# with open('sites_speed.json', 'w') as outfile:
#     json.dump(data, outfile, indent=2)
