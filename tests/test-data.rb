require 'kwalify'

# This function ensures that data in the database is formatted correctly
def validateData(basedir)
  puts "Validating data"

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

end

# Given an array of modules and a code, try to retrieve the module, if the
# code doesn't match return false else return the module and all its data
def getModuleByCode(code, modules)

  # Loop through each module
  for m in modules

    # If module codes match, return the module
    if m["code"] == code
      return m
    end
  end

  # If we've got this far, the module doesn't exist return false
  return false
end

# This function tests the module data to make sure it makes sense, e.g.
# ensuring that a module doesn't require another module which doesn't exist!
def testModules(basedir)

  puts "Testing module data."

  # Load in the data
  modules = Kwalify::Yaml.load_file("#{basedir}/_data/modules.yml")

  # Collect the modules which have requirements
  requires = modules.select { |m| not  m["requires"].nil?}

  # Now go through each module, which has requirements
  for m in requires

    # For each requirement
    for code in m["requires"]

      # Try and retrieve the module
      if not getModuleByCode(code, modules)
        fail "Module #{m["code"]}-#{m["name"]} depends on a module with code" +
             " #{code}, which doesn't exist"
      end
    end
  end
end

# The following are just a few helper functions to try and keep the testCourses
# function below cleaner

# This function goes through a course and collects all the module codes it includes
# and puts them into a single array
def collectModuleCodes(course)
  
  # Collect all the modules offered by this course
  course_modules = []

  for year in course["modules"]

    # Not every year could have core modules
    if not year["core"].nil?
      course_modules.concat(year["core"])
    end

    # Not every year could have optional modules
    if not year["optional"].nil?
      course_modules.concat(year["optional"])
    end
  end

  return course_modules
end

# This function tests all the course data ensuring that courses don't offer
# courses which don't exist and don't contain any modules with requirements that
# aren't offered in the same course
def testCourses(basedir)
  
  puts "Testing course data."
  
  # Load the data
  courses = Kwalify::Yaml.load_file("#{basedir}/_data/courses.yml")
  modules = Kwalify::Yaml.load_file("#{basedir}/_data/modules.yml")

  # Loop through each course
  for course in courses

    course_modules = collectModuleCodes(course)

    # Does a course include modules more than once
    if course_modules.length != course_modules.uniq.length
      fail "Course #{course["name"]} contains duplicate modules!"
    end

    # Now that we have the list of modules let's check what we need to
    for mCode in course_modules

      # Try and retrieve the module
      mod = getModuleByCode(mCode, modules)

      # First check, does the module actually exist?
      if not mod
        fail "Course #{course["name"]} includes a module #{mCode}, which doesn't exist"
      end

      # If the module does exist, see if it has requirements
      if mod["requires"]

        # Go through each requirement
        for req in mod["requires"]

          # We don't need to see if the module exists at all since this is done
          # earlier. However we do need to ensure that it's included in the current
          # course
          if not course_modules.include? req
            fail "Course #{course["name"]} includes a module " +
                 "#{mod["code"]}-#{mod["name"]} but not its pre-requsiste #{req}"
          end
        end
      end
    end
  end
end
