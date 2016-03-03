require 'html/proofer'

task default: %w[help]
task :help do
  exec("rake -T")
end

desc 'Build the site'
task :build do
  sh "bundle exec jekyll build"
end

desc 'Build the site and run the tests'
task :test => :build do
  HTML::Proofer.new("./_site",
                    { :check_html => true,
                      :only_4xx => true}).run()
end
