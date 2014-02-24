var RenderJob;

module.exports = {
  create: function(options) {
    var job;
    job = new RenderJob();
    return job;
  },
  RenderJob: RenderJob = (function() {
    function RenderJob(options) {}

    return RenderJob;

  })()
};
