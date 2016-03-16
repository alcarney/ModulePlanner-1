require 'bundler/setup'
require 'html-proofer'
require 'kwalify'
require 'jekyll'
require_relative 'tests/test-data'

task default: %w[help]
task :help do
  exec("rake -T")
end

desc 'Build the site'
task :build do
  sh "bundle exec jekyll build"
end

desc 'Build the site and run the tests'
task :test do

  basedir = File.dirname(__FILE__)

  validateData(basedir)
  testModules(basedir)
  testCourses(basedir)

  # Now it's yime to build the site
  conf = Jekyll.configuration(
    { 'source' => "./",
      'destination' => "./_site"})

  Jekyll::Site.new(conf).process

  HTMLProofer.check_directory("./_site",
                              { :check_html => true,
                                :only_4xx => true}).run
end
