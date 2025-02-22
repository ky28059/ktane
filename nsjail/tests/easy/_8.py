def check(a: str) -> bool:
    return a == a.upper()

NAME = "all_capital_letters"

def get_template() -> str:
    return """
'''
Return true if a is all capital letters
params: a: str
returns bool
'''
def all_capital_letters(a: str) -> bool:
    pass
"""