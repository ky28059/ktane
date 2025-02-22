def check(a: str) -> int:
    return sum(1 for char in a.lower() if char in "aeiou")

NAME = "count_vowels"

def get_template() -> str:
    return """
'''
Return the number of vowels in a
params: a: str
returns int
'''
def count_vowels(a: str) -> int:
    pass
"""