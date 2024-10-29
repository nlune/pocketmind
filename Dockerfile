# Pull miniconda from docker hub as base image
FROM continuumio/miniconda3:latest

RUN mkdir -p /backend
RUN mkdir -p /scripts
RUN mkdir -p /static-files
RUN mkdir -p /media-files
RUN mkdir -p /frontend


RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install curl -y
# Install node js version 20.x
RUN curl https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs


# Copy the requirements file from local folder to image
COPY ./backend/requirements.yml /backend/requirements.yml

# create the environment inside the docker container
RUN /opt/conda/bin/conda env create -f /backend/requirements.yml
COPY ./scripts /scripts
RUN chmod +x ./scripts #execution rights

# we set the path were all the python pacakages are
ENV PATH=/opt/conda/envs/pocketmind/bin:$PATH

# activate app
RUN echo "source activate pocketmind" >~/.bashrc

# Prevents the generation of PyCache that you might have trouble getting rid of, especially on the server
ENV PYTHONDONTWRITEBYTECODE=1

# Frontend
WORKDIR /frontend
COPY ./frontend/package.json /frontend/
COPY ./frontend/package-lock.json /frontend/

RUN npm install

COPY ./frontend /frontend
RUN npm run build


# pass all the files and folders from local folder to image
COPY ./backend /backend

# set the working directory to /app for whenever you login into your container
WORKDIR /backend
