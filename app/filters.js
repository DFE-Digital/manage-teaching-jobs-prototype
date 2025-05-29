const path = require('path')
const fs = require('fs')
const individualFiltersFolder = path.join(__dirname, './filters')

module.exports = function (env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  var filters = {}

  if (fs.existsSync(individualFiltersFolder)) {
    var files = fs.readdirSync(individualFiltersFolder)
    files.forEach(file => {
      let fileData = require(path.join(individualFiltersFolder, file))
      // Loop through each exported function in file (likely just one)
      Object.keys(fileData).forEach((filterGroup) => {
        // Get each method from the file
        Object.keys(fileData[filterGroup]).forEach(filterName => {
          filters[filterName] = fileData[filterGroup][filterName]
        })
      })
    })
  }

  /* ------------------------------------------------------------------
    add your methods to the filters obj below this comment block:
    @example:

    filters.sayHi = function(name) {
        return 'Hi ' + name + '!'
    }

    Which in your templates would be used as:

    {{ 'Paul' | sayHi }} => 'Hi Paul'

    Notice the first argument of your filters method is whatever
    gets 'piped' via '|' to the filter.

    Filters can take additional arguments, for example:

    filters.sayHi = function(name,tone) {
      return (tone == 'formal' ? 'Greetings' : 'Hi') + ' ' + name + '!'
    }

    Which would be used like this:

    {{ 'Joel' | sayHi('formal') }} => 'Greetings Joel!'
    {{ 'Gemma' | sayHi }} => 'Hi Gemma!'

    For more on filters and how to write them see the Nunjucks
    documentation.

  ------------------------------------------------------------------ */

  filters.jobStatusTagClass = (jobStatus) => {
    let tagClass;
    switch(jobStatus) {
      case 'Draft':
        tagClass = 'govuk-tag--grey'
        break;
      case 'Scheduled':
        tagClass = 'govuk-tag--yellow'
        break;
      case 'Active':
        tagClass = 'govuk-tag--green'
        break;
      case 'Closed':
        tagClass = 'govuk-tag--red'
        break;
        case 'Unread':
          tagClass = 'govuk-tag--blue'
          break;
          case 'New':
            tagClass = 'govuk-tag--blue'
            break;
      case 'Shortlisted':
        tagClass = 'govuk-tag--yellow'
        break;
      case 'Withdrawn':
        tagClass = 'govuk-tag--grey'
        break;
      case 'Reviewed':
        tagClass = 'govuk-tag--purple'
        break;
      case 'Interviewing':
        tagClass = 'govuk-tag--green'
        break;
      case 'Not considering':
        tagClass = 'govuk-tag--red'
        break;
    }
    
    return tagClass
  }

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}
