

module.exports = router => {


    router.get('/search', (req, res) => {
        let jobs = req.session.data.jobs.filter(job => job.status == 'Active')

        
        res.render('jobseekers/index', {
            jobs
        })
    })




}