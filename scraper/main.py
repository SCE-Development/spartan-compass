from scrapers import rmp, sjsu

def main():
  professors = rmp.get_professors()
  if professors:
    print("Professors:")
    for professor in professors:
      print(professor)
    print(f"Total Professors: {len(professors)}")
  classes = sjsu.get_classes()
  if classes:
    print("Professors:")
    for c in classes:
      print(c)
    print(f"Total Classes: {len(classes)}")

if __name__ == "__main__":
  main()