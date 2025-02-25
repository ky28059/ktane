def check(a: str) -> bool:
    return a == a.upper()

NAME = "no_lowercase_letters"

def get_template() -> str:
    return """
'''
Return true if a is not all lowercase
params: a: str
returns bool
'''
def no_lowercase_letters(a: str) -> bool:
    pass
"""
