import requests
from bs4 import BeautifulSoup

def get_classes():
    #url of latest class catalog
    url = "https://www.sjsu.edu/classes/schedules/spring-2025.php"

    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        
        table = soup.find('table', {'id': 'classSchedule'})
        
        if table:
            #set to remove duplicate classes and turn to array for output later
            unique_classes = set()
            for row in table.find('tbody').find_all('tr'):
                cells = row.find_all('td')
                class_info = {
                    "title": cells[3].text.strip(),
                    "subject": cells[0].text.strip().split()[0],
                    "courseNumber": cells[0].text.strip().split()[1],
                    "professor": cells[9].text.strip()
                }
                class_tuple = tuple(class_info.items())
                unique_classes.add(class_tuple)
            classes = [dict(cls) for cls in unique_classes]
            return classes
        else:
            return "No table found"
    else:
        return f"Error: Unable to fetch data. Status code: {response.status_code}"

