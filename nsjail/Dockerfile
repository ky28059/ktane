FROM python:slim-bookworm as chroot

COPY run.py /run/run.py
COPY consts.py /run/consts.py
COPY expected.py /run/expected.py
ADD tests /run/tests

FROM ghcr.io/google/nsjail/nsjail@sha256:a58a7293d7ca61cb282afacb5f117cc028aefb6f8cb674e3986b7b38b55ee1db

RUN apt-get update && apt-get install -y python3
RUN apt-get install -y python3-pip

RUN pip3 install --break-system-packages Flask

COPY --from=chroot / /chroot

RUN mkdir /chroot/run/dict
RUN mkdir /chroot/run/code

COPY app.py /app/app.py
COPY gen.py /app/gen.py
COPY consts.py /app/consts.py
COPY nsjail.cfg /app/nsjail.cfg
ADD tests /app/tests

RUN chmod +x /chroot/run/run.py
RUN chmod +x  /chroot/run/consts.py
RUN chmod +x  /chroot/run/expected.py

CMD cd app && python3 app.py