require 'bundler/setup'
require 'html/proofer'
require 'kwalify'
require 'jekyll'

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

  # First we need to test the data
  courseSchema = Kwalify::Yaml.load_file("#{basedir}/tests/course-schema.yaml")
  moduleSchema = Kwalify::Yaml.load_file("#{basedir}/tests/module-schema.yml")

  courseValidator = Kwalify::Validator.new(courseSchema)
  moduleValidator = Kwalify::Validator.new(moduleSchema)

  courses = Kwalify::Yaml.load_file("#{basedir}/_data/courses.yml")
  modules = Kwalify::Yaml.load_file("#{basedir}/_data/modules.yml")

  courseErrors = courseValidator.validate(courses)
  moduleErrors = moduleValidator.validate(modules)

  isError = false

  # Check for course errors
  if courseErrors && !courseErrors.empty?
    isError = true
    for e in courseErrors
      puts "[#{e.path}]: #{e.message}"
    end
  end

  # Check for module errors
  if moduleErrors && !moduleErrors.empty?
    isError = true
    for e in moduleErrors
      puts "[#{e.path}]: #{e.message}"
    end
  end

  # If there were errors, fail now
  if isError
    fail "There were some issues with the format of the data"
  end

  # Now it's yime to build the site
  conf = Jekyll.configuration(
    { 'source' => "./",
      'destination' => "./_site"})

  Jekyll::Site.new(conf).process

  HTML::Proofer.new("./_site",
                    { :check_html => true,
                      :only_4xx => true}).run()
end
