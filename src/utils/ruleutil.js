class LocalRulesService {
  getRules(key) {
    let stroredRules = localStorage[key];
    if (!stroredRules) {
      return [];
    }
    return JSON.parse(stroredRules);
  }
  setRules(commonRules, fewRules) {
    localStorage["commonRules"] = JSON.stringify(commonRules);
    localStorage["fewRules"] = JSON.stringify(fewRules);
  }
}

class RuleMatcher {
  constructor(rules) {
    this.lastRequestId = null;
    this.rules = rules;
  }

  redirectOnMatch(request) {
    var rule = _.find(this.rules, rule => {
      return (
        rule.isActive &&
        request.url.indexOf(rule.from) > -1 &&
        request.requestId !== this.lastRequestId
      );
    });

    if (rule) {
      this.lastRequestId = request.requestId;
      return {
        redirectUrl: request.url.replace(rule.from, rule.to)
      };
    }
  }
}

export { LocalRulesService, RuleMatcher };
