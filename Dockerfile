FROM ubuntu:latest

LABEL maintainer="Landr Rakotoarivelo"

WORKDIR /usr/share/hunspellmg

COPY . /usr/share/hunspellmg

RUN apt-get update \
    && apt install -y build-essential autoconf automake autopoint libtool libreadline-dev ca-certificates curl gnupg \
    && autoreconf -vfi \
    && ./configure --with-readline --with-warnings \
    && make \
    && make install \
    && ldconfig \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && NODE_MAJOR=21 \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt update \
    && apt-get install nodejs -y \
    && apt-get -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

