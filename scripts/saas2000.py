import json
import time
# import os
# import requests
from bs4 import BeautifulSoup
from selenium import webdriver

URL = 'https://saas1000.com/saas-1000-test/list/'
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}


def collect_pages():
    driver = webdriver.Chrome()
    for x in range(3, 41):
        driver.get(URL + str(x))
        time.sleep(2)
        c = driver.page_source
        file = open("pages/data" + str(x) + ".html", "w")
        file.write(c)
        file.close()
    driver.quit()


# collect_pages()
# quit()


companies = []

# with open('saas2000.json') as json_file:
#     companies = json.load(json_file)


# def city_count():
#     from collections import Counter
#     cities = []
#     for c in companies:
#         cities.append(c['city'])
#     # Counter(cities)
#     print(Counter(cities))

# cities = []
# print(city_count())

# cities = sum(value == 0 for value in D.values())


quit()

for x in range(1, 41):
    # r = requests.get(URL + str(x), headers=headers)
    # c = r.content
    file = open("pages/data" + str(x) + ".html", "r")
    c = file.read()

    soup = BeautifulSoup(c, features='lxml')
    tds = soup.find_all('td')
    trs = soup.find_all('tr')
    print(x, len(trs))

    for p in range(0, len(trs) - 1):
        # print(len(soup.find_all('td', class_='col_company_name')))
        # print(p)
        name = soup.find_all('td', class_='col_company_name')[p]
        company = {
            'name': name.find_all('a')[1].text,
            'url': name.find_all('a')[0]['href'].replace('//', 'https://'),
            'linkedin': name.find_all('a')[2]['href'],
            'city': soup.find_all('td', class_='col_city')[p].text,
            'state': soup.find_all('td', class_='col_state')[p].text,
            # 'country': soup.find_all('td', class_='col_country')[p].text,
            # 'before': tds[p + 6].decode_contents(),
            'employees': soup.find_all('td', class_='col_may_2017_employees')[p].text,
            'growth': soup.find_all('td', class_='col_6_month_growth')[p].text,
            'investor': soup.find_all('td', class_='col_leadinvestor')[p].text,
            'rank': soup.find_all('td', class_='col_CurrentRanking')[p].text
        }
        companies.append(company)

    # for p in range(0, len(tds), 12):
    #     company = {
    #         'name': tds[p].find('img')['alt'],
    #         'url': tds[p + 1].decode_contents(),
    #         'linkedin': tds[p + 2].decode_contents(),
    #         'city': tds[p + 3].decode_contents(),
    #         'state': tds[p + 4].decode_contents(),
    #         'country': tds[p + 5].decode_contents(),
    #         'before': tds[p + 6].decode_contents(),
    #         'after': tds[p + 7].decode_contents(),
    #         'growth': tds[p + 8].decode_contents(),
    #         'investor': tds[p + 9].decode_contents(),
    #         'rank': tds[p + 11].decode_contents()
    #     }
    #     trs.append(company)

    with open('saas2000.json', 'w') as outfile:
        json.dump(companies, outfile, indent=2)
