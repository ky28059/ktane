def check(a: str, b: str) -> str:
    return f'{a}{b}'

NAME = "concat_strings"

def get_template() -> str:
    return """
'''
Concat two strings
params: a, b
returns ab
'''
def concat_strings(a: str, b: str) -> str:
    pass
"""