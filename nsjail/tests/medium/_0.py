def check(a: int) -> float:
    return round((a * 9/5) + 32, 2)

NAME = "celsius_to_fahrenheit"

def get_template() -> str:
    return """
'''
Convert celsius to fahrenheit, round to two decimal places
params: a - celsius
returns a in fahrenheit
'''
def celsius_to_fahrenheit(a: int) -> float:
    pass
"""