from scrapers import rmp

def main():
  professors = rmp.get_professors()
  if professors:
    print("Professors:")
    for professor in professors:
      print(professor)
    print(f"Total Professors: {len(professors)}")

if __name__ == "__main__":
  main()