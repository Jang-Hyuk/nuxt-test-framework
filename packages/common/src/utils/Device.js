const compareVersions = require('compare-versions');

class CmDeviceUtil {
	#REGEX_MOBILE_OR_TABLET1 =
		/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|FBAN|FBAV|fennec|hiptop|iemobile|ip(hone|od)|Instagram|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i;

	#REGEX_MOBILE_OR_TABLET2 =
		// eslint-disable-next-line no-useless-escape
		/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;

	#serverNameList = ['CLUBTONG', 'partner', 'club5678'];

	appInfo = {
		appName: '',
		smtpSlct: '',
		smtpId: '',
		appVer: '',
		phoneVer: '',
	};

	/** @type {'s' | 'x' | 'w'} s: App, x: mobile, w: web */
	media;

	/** @type {{APP: 's', MOBILE: 'x', PC_WEB: 'w'}}  */
	mediaOption = {
		APP: 's',
		MOBILE: 'x',
		PC_WEB: 'w',
	};

	// eslint-disable-next-line
  #REGEX_CRAWLER = 
		/Googlebot\/|Googlebot-Mobile|Googlebot-Image|Googlebot-News|Googlebot-Video|AdsBot-Google([^-]|$)|AdsBot-Google-Mobile|Feedfetcher-Google|Mediapartners-Google|Mediapartners \(Googlebot\)|APIs-Google|bingbot|Slurp|[wW]get|LinkedInBot|Python-urllib|python-requests|aiohttp|httpx|libwww-perl|httpunit|nutch|Go-http-client|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|BIGLOTRON|Teoma|convera|seekbot|Gigabot|Gigablast|exabot|ia_archiver|GingerCrawler|webmon |HTTrack|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|findlink|msrbot|panscient|yacybot|AISearchBot|ips-agent|tagoobot|MJ12bot|woriobot|yanga|buzzbot|mlbot|YandexBot|YandexImages|YandexAccessibilityBot|YandexMobileBot|YandexMetrika|YandexTurbo|YandexImageResizer|YandexVideo|YandexAdNet|YandexBlogs|YandexCalendar|YandexDirect|YandexFavicons|YaDirectFetcher|YandexForDomain|YandexMarket|YandexMedia|YandexMobileScreenShotBot|YandexNews|YandexOntoDB|YandexPagechecker|YandexPartner|YandexRCA|YandexSearchShop|YandexSitelinks|YandexSpravBot|YandexTracker|YandexVertis|YandexVerticals|YandexWebmaster|YandexScreenshotBot|purebot|Linguee Bot|CyberPatrol|voilabot|Baiduspider|citeseerxbot|spbot|twengabot|postrank|TurnitinBot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|Ahrefs(Bot|SiteAudit)|fuelbot|CrunchBot|IndeedBot|mappydata|woobot|ZoominfoBot|PrivacyAwareBot|Multiviewbot|SWIMGBot|Grobbot|eright|Apercite|semanticbot|Aboundex|domaincrawler|wbsearchbot|summify|CCBot|edisterbot|seznambot|ec2linkfinder|gslfbot|aiHitBot|intelium_bot|facebookexternalhit|Yeti|RetrevoPageAnalyzer|lb-spider|Sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|OrangeBot\/|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|S[eE][mM]rushBot|yoozBot|lipperhey|Y!J|Domain Re-Animator Bot|AddThis|Screaming Frog SEO Spider|MetaURI|Scrapy|Livelap[bB]ot|OpenHoseBot|CapsuleChecker|collection@infegy.com|IstellaBot|DeuSu\/|betaBot|Cliqzbot\/|MojeekBot\/|netEstate NE Crawler|SafeSearch microdata crawler|Gluten Free Crawler\/|Sonic|Sysomos|Trove|deadlinkchecker|Slack-ImgProxy|Embedly|RankActiveLinkBot|iskanie|SafeDNSBot|SkypeUriPreview|Veoozbot|Slackbot|redditbot|datagnionbot|Google-Adwords-Instant|adbeat_bot|WhatsApp|contxbot|pinterest.com.bot|electricmonk|GarlikCrawler|BingPreview\/|vebidoobot|FemtosearchBot|Yahoo Link Preview|MetaJobBot|DomainStatsBot|mindUpBot|Daum\/|Jugendschutzprogramm-Crawler|Xenu Link Sleuth|Pcore-HTTP|moatbot|KosmioBot|pingdom|AppInsights|PhantomJS|Gowikibot|PiplBot|Discordbot|TelegramBot|Jetslide|newsharecounts|James BOT|Bark[rR]owler|TinEye|SocialRankIOBot|trendictionbot|Ocarinabot|epicbot|Primalbot|DuckDuckGo-Favicons-Bot|GnowitNewsbot|Leikibot|LinkArchiver|YaK\/|PaperLiBot|Digg Deeper|dcrawl|Snacktory|AndersPinkBot|Fyrebot|EveryoneSocialBot|Mediatoolkitbot|Luminator-robots|ExtLinksBot|SurveyBot|NING\/|okhttp|Nuzzel|omgili|PocketParser|YisouSpider|um-LN|ToutiaoSpider|MuckRack|Jamie's Spider|AHC\/|NetcraftSurveyAgent|Laserlikebot|^Apache-HttpClient|AppEngine-Google|Jetty|Upflow|Thinklab|Traackr.com|Twurly|Mastodon|http_get|DnyzBot|botify|007ac9 Crawler|BehloolBot|BrandVerity|check_http|BDCbot|ZumBot|EZID|ICC-Crawler|ArchiveBot|^LCC |filterdb.iss.net\/crawler|BLP_bbot|BomboraBot|Buck\/|Companybook-Crawler|Genieo|magpie-crawler|MeltwaterNews|Moreover|newspaper\/|ScoutJet|(^| )sentry\/|StorygizeBot|UptimeRobot|OutclicksBot|seoscanners|Hatena|Google Web Preview|MauiBot|AlphaBot|SBL-BOT|IAS crawler|adscanner|Netvibes|acapbot|Baidu-YunGuanCe|bitlybot|blogmuraBot|Bot.AraTurka.com|bot-pge.chlooe.com|BoxcarBot|BTWebClient|ContextAd Bot|Digincore bot|Disqus|Feedly|Fetch\/|Fever|Flamingo_SearchEngine|FlipboardProxy|g2reader-bot|G2 Web Services|imrbot|K7MLWCBot|Kemvibot|Landau-Media-Spider|linkapediabot|vkShare|Siteimprove.com|BLEXBot\/|DareBoost|ZuperlistBot\/|Miniflux\/|Feedspot|Diffbot\/|SEOkicks|tracemyfile|Nimbostratus-Bot|zgrab|PR-CY.RU|AdsTxtCrawler|Datafeedwatch|Zabbix|TangibleeBot|google-xrawler|axios|Amazon CloudFront|Pulsepoint|CloudFlare-AlwaysOnline|Google-Structured-Data-Testing-Tool|WordupInfoSearch|WebDataStats|HttpUrlConnection|Seekport Crawler|ZoomBot|VelenPublicWebCrawler|MoodleBot|jpg-newsbot|outbrain|W3C_Validator|Validator\.nu|W3C-checklink|W3C-mobileOK|W3C_I18n-Checker|FeedValidator|W3C_CSS_Validator|W3C_Unicorn|Google-PhysicalWeb|Blackboard|ICBot\/|BazQux|Twingly|Rivva|Experibot|awesomecrawler|Dataprovider.com|GroupHigh\/|theoldreader.com|AnyEvent|Uptimebot\.org|Nmap Scripting Engine|2ip.ru|Clickagy|Caliperbot|MBCrawler|online-webceo-bot|B2B Bot|AddSearchBot|Google Favicon|HubSpot|Chrome-Lighthouse|HeadlessChrome|CheckMarkNetwork\/|www\.uptime\.com|Streamline3Bot\/|serpstatbot\/|MixnodeCache\/|^curl|SimpleScraper|RSSingBot|Jooblebot|fedoraplanet|Friendica|NextCloud|Tiny Tiny RSS|RegionStuttgartBot|Bytespider|Datanyze|Google-Site-Verification|TrendsmapResolver|tweetedtimes|NTENTbot|Gwene|SimplePie|SearchAtlas|Superfeedr|feedbot|UT-Dorkbot|Amazonbot|SerendeputyBot|Eyeotabot|officestorebot|Neticle Crawler|SurdotlyBot|LinkisBot|AwarioSmartBot|AwarioRssBot|RyteBot|FreeWebMonitoring SiteChecker|AspiegelBot|NAVER Blog Rssbot|zenback bot|SentiBot|Domains Project\/|Pandalytics|VKRobot|bidswitchbot|tigerbot|NIXStatsbot|Atom Feed Robot|Curebot|PagePeeker\/|Vigil\/|rssbot\/|startmebot\/|JobboerseBot|seewithkids|NINJA bot|Cutbot|BublupBot|BrandONbot|RidderBot|Taboolabot|Dubbotbot|FindITAnswersbot|infoobot|Refindbot|BlogTraffic\/\d\.\d+ Feed-Fetcher|SeobilityBot|Cincraw|Dragonbot|VoluumDSP-content-bot|FreshRSS|BitBot|^PHP-Curl-Class|Google-Certificates-Bridge/;

	/**
	 * @param {object} opt http user-agent
	 * @param {string} opt.userAgent http user-agent
	 * @example
	 * httpUserAgent: "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36"
	 *   android: Mozilla/5.0 (Linux; Android 10; SM-G960N Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.45 Mobile Safari/537.36 CLUBTONG|a|4596e586c2355918|2.14.327|10
	 */
	constructor(opt) {
		const { userAgent } = opt;

		// DI
		this.userAgent = userAgent;

		// App 여부 판단 'Safari/537.36' 이런 값을 split
		const [appName, smtpSlct, smtpId, appVer, phoneVer] = this.userAgent
			.split(' ')
			.pop()
			.split('|');

		const { APP, MOBILE, PC_WEB } = this.mediaOption;

		this.media = this.#isMobile(userAgent) ? MOBILE : PC_WEB;

		if (this.#serverNameList.includes(appName)) {
			this.media = APP;

			this.appInfo = {
				appName,
				appVer,
				phoneVer,
				smtpId,
				smtpSlct,
			};
		}
	}

	/** isSafari, isFirefox, isEdge, isChrome, isSamsung  */
	get browser() {
		const browserName = this.#getBrowserName();

		return {
			isSafari: browserName === 'Safari',
			isFirefox: browserName === 'Firefox',
			isEdge: browserName === 'Edge',
			isChrome: browserName === 'Chrome',
			isSamsung: browserName === 'Samsung',
		};
	}

	/**
	 * 모바일이면 x를 pc에서 접속했으면 w를
	 * @returns {'x' | 'w'}
	 *  */
	get mediaType() {
		const { MOBILE, PC_WEB } = this.mediaOption;
		return this.#isMobile() ? MOBILE : PC_WEB;
	}

	/** isAndroid, isIos, isWindows, isMacOS */
	get os() {
		return {
			isAndroid: this.#isAndroid(),
			isIos: this.#isIos(),
			isWindows: this.#isWindows(),
			isMacOS: this.#isMacOS(),
		};
	}

	/** isApp, isMobile, isDesktop, ... */
	get platform() {
		return {
			isMobile: this.#isMobile(),
			isMobileOrTablet: this.#isMobileOrTablet(),
			isTablet: this.#isMobile() === false && this.#isMobileOrTablet(),
			isDesktop: this.#isMobileOrTablet() === false,
			isDesktopOrTablet: this.#isMobile() === false,
			isCrawler: this.#REGEX_CRAWLER.test(this.userAgent),
		};
	}

	/** isApp, isTong, isPartner, isClub5678, isNothing(회사 Service) */
	get services() {
		const serviceIndex = this.#serverNameList.findIndex(
			serverName => serverName === this.appInfo.appName,
		);

		return {
			isApp: this.isApp(),
			isTong: serviceIndex === 0,
			isPartner: serviceIndex === 1,
			isClub5678: serviceIndex === 2,
			isNothing: serviceIndex === -1,
		};
	}

	/**
	 * Semantic Versioning 형식으로 들어오는 두 버젼 비교
	 * @param {string} firstVersion
	 * @param {string} secondVersion
	 * @returns {number} This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
	 * @example
	 * compareVersions('11.1.1', '10.0.0'); //  1
	 * compareVersions('10.0.0', '10.0.0'); //  0
	 * compareVersions('10.0.0', '11.1.1'); // -1
	 */
	compareVersion(firstVersion = '', secondVersion = '') {
		return compareVersions(firstVersion, secondVersion);
	}

	/** platform */
	isApp() {
		return this.media === this.mediaOption.APP;
	}

	/**
	 * browser Name
	 * @param {string} [userAgent = this.userAgent]
	 */
	#getBrowserName(userAgent = this.userAgent) {
		// https://github.com/lancedikson/bowser/blob/master/LICENSE
		const browsers = [
			{ name: 'Samsung', test: /SamsungBrowser/i },
			{ name: 'Edge', test: /edg([ea]|ios|)\//i },
			{ name: 'Firefox', test: /firefox|iceweasel|fxios/i },
			{ name: 'Chrome', test: /chrome|crios|crmo/i },
			{ name: 'Safari', test: /safari|applewebkit/i },
		];

		// eslint-disable-next-line no-restricted-syntax
		for (const b of browsers) {
			if (b.test.test(userAgent)) {
				return b.name;
			}
		}
	}

	/**
	 * os
	 * @param {string} [userAgent]
	 */
	#isAndroid(userAgent = this.userAgent) {
		return /Android/i.test(userAgent);
	}

	/**
	 * os
	 * @param {string} [userAgent = this.userAgent]
	 */
	#isIos(userAgent = this.userAgent) {
		return /iPad|iPhone|iPod/i.test(userAgent);
	}

	/**
	 * os
	 * @param {string} [userAgent = this.userAgent]
	 */
	#isMacOS(userAgent = this.userAgent) {
		return /Mac OS X/.test(userAgent);
	}

	/**
	 * platform
	 * @param {string} [userAgent = this.userAgent]
	 */
	#isMobile(userAgent = this.userAgent) {
		return /phone|samsung|lgtel|mobile|[^A]skt|nokia|blackberry|BB10|android|sony/i.test(
			userAgent,
		);
	}

	/**
	 * platform
	 * @param {string} [userAgent = this.userAgent]
	 */
	#isMobileOrTablet(userAgent = this.userAgent) {
		return (
			this.#REGEX_MOBILE_OR_TABLET1.test(userAgent) ||
			this.#REGEX_MOBILE_OR_TABLET2.test(userAgent.substr(0, 4))
		);
	}

	/**
	 * os
	 * @param {string} [userAgent = this.userAgent]
	 */
	#isWindows(userAgent = this.userAgent) {
		return /Windows/.test(userAgent);
	}
}

module.exports = CmDeviceUtil;
