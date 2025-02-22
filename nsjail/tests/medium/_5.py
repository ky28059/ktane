def check(a: list) -> list:
    return a[::-1]

NAME = "reverse_list"

def get_template() -> str:
    return """
'''
Returns the reversed list
params: list
returns list
'''
def reverse_list(a: list) -> list:
    pass
"""