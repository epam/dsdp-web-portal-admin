// apiUrl exists here only for local development, in CI environment apiUrl variable should be replaced to empty string
// or to any falsy value

const ENVIRONMENT_VARIABLES = {
  apiUrl: 'https://admin-tools-rus-property-main.apps.kraken-super-team.mdtu-ddm.projects.epam.com',
  kibanaUrl: 'https://kibana-openshift-logging.apps.cicd2.mdtu-ddm.projects.epam.com',
  userLoadLogFilter: `/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-2h,mode:quick,to:now))&_a=(columns:!(kubernetes.pod_name,structured.message),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,key:kubernetes.container_name,negate:!f,params:(query:publish-users-job,type:phrase),type:phrase,value:publish-users-job),query:(match:(kubernetes.container_name:(query:publish-users-job,type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,key:structured.logger,negate:!f,params:!(UserPublisherApplication,com.epam.digital.data.platform.user.service.ValidationService,com.epam.digital.data.platform.user.service.SkippingService,com.epam.digital.data.platform.user.service.UserPublishingService),type:phrases,value:'UserPublisherApplication,com.epam.digital.data.platform.user.service.ValidationService,com.epam.digital.data.platform.user.service.SkippingService,com.epam.digital.data.platform.user.service.UserPublishingService'),query:(bool:(minimum_should_match:1,should:!((match_phrase:(structured.logger:UserPublisherApplication)),(match_phrase:(structured.logger:com.epam.digital.data.platform.user.service.ValidationService)),(match_phrase:(structured.logger:com.epam.digital.data.platform.user.service.SkippingService)),(match_phrase:(structured.logger:com.epam.digital.data.platform.user.service.UserPublishingService))))))),interval:auto,query:(language:lucene,query:''),sort:!('@timestamp',asc))`,
  languageServerUrl: 'wss://admin-tools-kraken-qa.apps.cicd2.mdtu-ddm.projects.epam.com/admin/ls',
  digitalDocumentsMaxFileSize: '100MB',
  digitalDocumentsMaxTotalFileSize: '100MB',
  language: 'uk',
  supportedLanguages: ['uk', 'en'],
  region: 'ua',
  emailBlacklist: [
    'mail.ru',
    'internet.ru',
    'list.ru',
    'bk.ru',
    'inbox.ru',
    'mail.ua',
    'mail.kz',
    'mail.md',
    'yandex.ru',
    'yandex.ua',
    'mail.yandex.ru',
    'mail.yandex.ua',
    'ya.ru',
    'ya.ua',
    'yandex.kz',
    'yandex.by',
    'yandex.com',
  ],
  cicdUrl: 'https://admin-tools-abc-02-main.apps.01-9-10-52-pst.mdtu-ddm.projects.epam.com/cicd/job/registry-regulations/job/MASTER-Build-registry-regulations/'
};
