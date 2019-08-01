const request = require('../lib/functions/Request');
const getURL = require('../lib/functions/GetURL');
const akinatorAPIErrors = require('../errors/AkinatorAPIErrors');

/**
 * gets a step for aki by requesting the correct data.
 * @param region the supplied region area.
 * @param session the akinator session
 * @param signature the akinator signature
 * @param step the number of step this is on.
 */
module.exports = async (region, session, signature, step) => {
  const id = getURL(region);
  const result = await request(`https://${id}/ws/list?session=${session}&signature=${signature}&step=${step}`);
  const { body, statusCode } = result;
  if (statusCode === 200) {
    return {
      answers: (body.parameters.elements || []).map(ele => ele.element),
      currentStep: step,
      nextStep: step + 1,
      guessCount: body.parameters.NbObjetsPertinents, // number of guesses akinator holds
    };
  }
  return akinatorAPIErrors(body, region);
};
