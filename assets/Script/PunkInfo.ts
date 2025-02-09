const {ccclass, property} = cc._decorator;

@ccclass
export default class PunkInfo extends cc.Component {
	
	id: number = 0;
	gold: number = 0;
	hp: number = 0;
	evil: number = 0;
	seed: string = '';
	userName: string = 'vistor';
	action: string = 'Unknown';
	
	@property(cc.Label)
    leftLabel: cc.Label = null;
	
	@property(cc.Label)
    rightLabel: cc.Label = null;
	
	@property(cc.Button)
    attackButton: cc.Button = null;
	
	@property(cc.Button)
    quitButton: cc.Button = null;
	
	lastPunk (e, msg) {
		cc.log('lastPunk')
    },
	
	nextPunk (e, msg) {
		cc.log('nextPunk')
    },
	
	setLabel () {
		const lang = cc.sys.localStorage.getItem('lang')
		if (lang === 'zh') {
			this.leftLabel.string = `ID: ${this.id-1} \nHP: ${this.hp} \n等级: ${this.evil}`
			this.rightLabel.string = `昵称: ${this.userName} \n状态: ${this.action} \n鱿鱼币: ${this.gold}`
		}
		else {
			this.leftLabel.string = `ID: ${this.id-1} \nHP: ${this.hp} \nLevel: ${this.evil}`
			this.rightLabel.string = `Name: ${this.userName} \nStatus: ${this.action} \nSQUIDs: ${this.gold}`
		}
    },
	
	setId (id) {
		this.id = id
		this.setLabel()
    },
	
	setInfo (info) {
		if (info.name == "") {
			this.userName = info.address.slice(0, 6)
		}
		else {
			this.userName = info.name.substr(0,9)
		}
		const lang = cc.sys.localStorage.getItem('lang')
		if (info.isMoving) {
			this.action = (lang === 'zh'? '移动中' : 'Moving')
		}
		else {
			this.action = (lang === 'zh'? '挖矿中' : 'Mining')
		}
		this.gold = info.gold
		this.hp = info.hp
		this.evil = info.evil
		this.seed = info.seed
		this.setLabel()
    },
	
	setAttack (attackable) {
		this.attackButton.interactable = attackable
    },
	
	async attack (e, msg) {
		this.quitButton.interactable = false
		
		const data = await this.game.attack(this.id, this.seed, this.userName)
		this.hp -= data.damage
		this.seed = data.newSeed
		this.setLabel()
		if (this.hp <= 0) {
			this.game.setDieMessage(data.name, this.userName, Number(this.gold))
			this.cancle()
		}
		else {
			this.attackButton.interactable = true
		    this.quitButton.interactable = true
		}
    },
	
	cancle (e, msg) {
        cc.log('quit');
		this.node.destroy()
    },

	onLoad () {
		this.attackButton.interactable = false
    },

    start () {

    }
}
