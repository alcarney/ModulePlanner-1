# ModulePlanner 
[![Build Status](https://travis-ci.org/Moduleplanner/Moduleplanner.github.io.svg?branch=master)](https://travis-ci.org/Moduleplanner/Moduleplanner.github.io) [![Documentation Status](https://readthedocs.org/projects/moduleplannergithubio/badge/?version=latest)](http://moduleplannergithubio.readthedocs.org/en/latest/?badge=latest)

[![Join the chat at https://gitter.im/Moduleplanner/Moduleplanner.github.io](https://badges.gitter.im/Moduleplanner/Moduleplanner.github.io.svg)](https://gitter.im/Moduleplanner/Moduleplanner.github.io?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


A website to help students choose their modules

Implementation based on this [codepen](http://codepen.io/alcarney/pen/VaYYgp?editors=1111)

Installation
============

To run this locally on your machine first fork this repository and then clone your fork
```
$ git clone https://github.com/YOUR-NAME/ModulePlanner.git
```
then run `jekyll serve` whilst in your clone

Docker
======

Alternatively, you can use [docker](https://www.docker.com/) to build and serve
the site for you. If you haven't used docker before here are instructions to get started
on [Linux](https://docs.docker.com/linux/),
[Mac](https://docs.docker.com/mac/) or [Windows](https://docs.docker.com/windows/).

Once you have docker installed you can build the container image by running the
following command from the same directory as the `Dockerfile`.

```
$ docker build -t jekyll:moduleplanner .
```

Where `jekyll:moduleplanner` is the name that will be given to the container when it
is built. You can replace this with whatever you like provided you stick with the
`<repository>:<label>` format.

**Important!:** You will need to rebuild your image if changes to the `Gemfile` are made.

Once docker has successfully built the image you can build and view the site locally
by running the following

```
$ docker run --rm -it -v /full/path/to/this/repository:/site -p 127.0.0.1:4000:4000 jekyll:moduleplanner
```

You should see some output from Jekyll saying that it is building and serving the site
so if you open your web browser to `http://127.0.0.1:4000` you should be able to see the moduleplanner.

To finish up here is a quick rundown on what that command means above:

- `docker run`: We say to docker we want to create a new instance of an image as a container

- `--rm`: Clean up after the container when it exits

- `-it`: We want the container run interactively (so we can see it's output)

- `-v /full/path/to/this/repository:/site`: This is how we load the website into the container
  using something called volumes. Essentially there is a folder inside the image called `/site`
  which when we create a new container we want to mount the folder `/full/path/to/this/repository`
  into it, this is so that the Jekyll process running inside the container can see the website and
  build it. *Note:* It's important that that you include the *full* filepath to this folder. A quicker
  way you could type this part of the command on Linux, would be to use the following `-v $(pwd):/site`

- `-p 127.0.0.1:4000:4000` As well as the site data, our web browser needs to communicate with the
  Jekyll process to view the generated website, so this command maps the container's internal port
  4000 to your machine's port 4000 so that your browser can make the connection.

- `jekyll:moduleplanner`: Finally we need to tell docker which image to create an container of, this
  is simply the name you gave it when you built the image above.

Documentation
============

The documentation for this repository can be found [here.](http://moduleplannergithubio.readthedocs.org)

Contributing
============

There are many tasks that need completing before this can even be considered
useful:

  - [x] Students should be able to select the modules they wish to take
  - [x] Students should be able to select their degree scheme as this alters
        which modules are core and what optional modules are available.
  - [x] Add pre-requisite & provides to module yaml file.
  - [ ] Modules should grey-out as they become unavailable.
  - [ ] We need a good way of handling the placement of modules on screen
        so that related modules are placed near each other so that we dont have
        a mess.
