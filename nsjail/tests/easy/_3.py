def check(a: str, b: str) -> bool:
    return a.startswith(b)

NAME = "string_starts_with"

def get_template() -> str:
    return """
'''
Return true if a starts with b
params: a: str, b: str
returns bool
'''
def string_starts_with(a: str, b: str) -> bool:
    pass
"""