def check(s: str) -> str:
    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        return s[l + 1:r]
    
    result = ""
    for i in range(len(s)):
        odd = expand(i, i)
        even = expand(i, i + 1)
        result = max(result, odd, even, key=len)
    return result

NAME = "longest_palindromic_substring"

def get_template() -> str:
    return """
'''
Finds the longest palindromic substring in a string
params: str
returns str
'''
def longest_palindromic_substring(s: str) -> str:
    pass
"""