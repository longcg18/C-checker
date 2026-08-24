FROM python:3.12

RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /home/user/app

COPY --chown=user:user requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=user:user backend.py database.py ./

EXPOSE 7860

CMD ["uvicorn", "backend:app", "--host", "0.0.0.0", "--port", "7860"]
