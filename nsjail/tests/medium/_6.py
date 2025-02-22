def check(a: str, b: str) -> bool:
    return sorted(a.lower()) == sorted(b.lower())

NAME = "anagram_checker"

def get_template() -> str:
    return """
'''
Returns whether or not a and b are anagrams
params: str, str
returns bool
'''
def anagram_checker(a: str, b: str) -> bool:
    pass
"""