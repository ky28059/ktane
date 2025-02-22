def check(a: str, b: str) -> bool:
    return a.endswith(b)

NAME = "string_ends_with"

def get_template() -> str:
    return """
'''
Return true if a ends with b
params: a: str, b: str
returns bool
'''
def string_ends_with(a: str, b: str) -> bool:
    pass
"""