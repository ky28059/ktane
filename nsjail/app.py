from flask import Flask, request
from consts import Difficulty, CHROOT_DIR
from gen import generate_template
from subprocess import check_output
from secrets import token_hex
from json import dumps, loads
from os import remove


app = Flask(__name__)

@app.post("/gen")
def gen():
    data: dict = request.json
    return generate_template(Difficulty(data["difficulty"]), int(data["num"]))

@app.post("/run")
def run():
    data: dict = request.json
    dict_fname = f'/run/dict/{token_hex(16)}'
    code_fname = f'/run/code/{token_hex(16)}'
    with open(CHROOT_DIR+dict_fname, "w") as f:
        f.write(dumps(data["nums"]))
    with open(CHROOT_DIR+code_fname, "w") as f:
        f.write(data["code"])
    cmd = f'nsjail --config /app/nsjail.cfg -- /run/run.py {dict_fname} {code_fname}'
    try:
        output = {"tests": loads(check_output(cmd, shell=True, text=True)), "all_tests_failed": False}
    except Exception:
        output = {"tests": {}, "all_tests_failed":  True}
    remove(CHROOT_DIR+dict_fname)
    remove(CHROOT_DIR+code_fname)
    return output

if __name__ == "__main__":
    app.run("0.0.0.0", port=5001)