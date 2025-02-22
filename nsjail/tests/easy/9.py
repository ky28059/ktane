def count_vowels(a: str) -> int:
    return sum(1 for char in a.lower() if char in "aeiou")

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