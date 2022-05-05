#!/bin/bash
ng build &&
docker build -t carform . &&
docker run -p 4300:80 carform
