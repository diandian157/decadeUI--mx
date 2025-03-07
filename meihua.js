"use strict";
decadeModule.import(function (lib, game, ui, get, ai, _status) {
	//神势力选择
	lib.skill._group = {
		charlotte: true,
		ruleSkill: true,
		trigger: {
			global: "gameStart",
			player: "enterGame",
		},
		forced: true,
		popup: false,
		silent: true,
		priority: 520,
		firstDo: true,
		direct: true,
		filter(event, player) {
			// 检查是否有特定技能和状态
			if (player.hasSkill("mbjsrgxiezheng")) return false;
			// 检查游戏模式
			if (!["doudizhu", "versus"].includes(get.mode())) return false;
			// 检查角色类型
			if (lib.character[player.name1][1] === "shen") return true;
		},
		content() {
			"step 0";
			const name = player.name1;
			let options;
			options = lib.group.filter(group => group !== "shen");
			player.chooseControl(options).set("prompt", "请选择神武将的势力");
			("step 1");
			if (result.control) {
				player.changeGroup(result.control);
			}
		},
	};

	//武将背景
	if (lib.config["extension_十周年UI_wujiangbeijing"]) {
		lib.skill._wjBackground = {
			charlotte: true,
			forced: true,
			popup: false,
			trigger: {
				global: ["gameStart", "modeSwitch"],
				player: ["enterGame", "showCharacterEnd"],
			},
			priority: 100,
			content() {
				const setBackground = player => {
					if (!player) return;
					// 检查游戏模式和双将设置
					const mode = get.mode();
					const isDoubleCharacter = lib.config.mode_config[mode] && lib.config.mode_config[mode].double_character;
					if (mode === "guozhan" || isDoubleCharacter) {
						// 国战模式或开启双将时使用bj2
						player.setAttribute("data-mode", "guozhan");
					} else {
						// 其他情况使用bj1
						player.setAttribute("data-mode", "normal");
					}
				};
				// 为所有玩家设置背景
				game.players.forEach(setBackground);
				game.dead.forEach(setBackground);
			},
		};
		// 添加全局技能
		if (!_status.connectMode) {
			game.addGlobalSkill("_wjBackground");
		}
		// 在游戏开始时检查并设置背景
		lib.arenaReady.push(function () {
			const mode = get.mode();
			const isDoubleCharacter = lib.config.mode_config[mode] && lib.config.mode_config[mode].double_character;
			if (mode === "guozhan" || isDoubleCharacter) {
				document.body.setAttribute("data-mode", "guozhan");
			} else {
				document.body.setAttribute("data-mode", "normal");
			}
		});
	}

	// 全选按钮功能 by奇妙工具做修改
	lib.hooks.checkBegin.add("Selectall", () => {
		const event = get.event();
		const needMultiSelect = event.selectCard?.[1] > 1;
		// 创建或移除全选按钮
		if (needMultiSelect && !ui.Selectall) {
			ui.Selectall = ui.create.control("全选", () => {
				// 选择所有手牌
				ai.basic.chooseCard(card => (get.position(card) === "h" ? 114514 : 0));
				// 执行自定义添加卡牌函数
				event.custom?.add?.card?.();
				// 更新选中卡牌显示
				ui.selected.cards?.forEach(card => card.updateTransform(true));
			});
		} else if (!needMultiSelect) {
			removeCardQX();
		}
	});
	lib.hooks.uncheckBegin.add("Selectall", () => {
		if (get.event().result?.bool) {
			removeCardQX();
		}
	});
	// 抽取移除按钮的公共函数
	const removeCardQX = () => {
		if (ui.Selectall) {
			ui.Selectall.remove();
			delete ui.Selectall;
		}
	};

	// 局内交互优化
	if (lib.config["extension_十周年UI_jiaohuyinxiao"]) {
		lib.skill._useCardAudio = {
			trigger: {
				player: "useCard",
			},
			forced: true,
			popup: false,
			priority: -10,
			content() {
				let card = trigger.card;
				let cardType = get.type(card);
				let cardName = get.name(card);
				let cardNature = get.nature(card);
				if (cardType == "basic") {
					switch (cardName) {
						case "sha":
							if (cardNature == "fire") {
								game.playAudio("..", "extension", "十周年UI", "audio/GameShowCard");
							} else if (cardNature == "thunder") {
								game.playAudio("..", "extension", "十周年UI", "audio/GameShowCard");
							} else {
								game.playAudio("..", "extension", "十周年UI", "audio/GameShowCard");
							}
							break;
						case "shan":
							game.playAudio("..", "extension", "十周年UI", "audio/GameShowCard");
							break;
						case "tao":
							game.playAudio("..", "extension", "十周年UI", "audio/GameShowCard");
							break;
						case "jiu":
							game.playAudio("..", "extension", "十周年UI", "audio/GameShowCard");
							break;
						default:
							game.playAudio("..", "extension", "十周年UI", "audio/GameShowCard");
					}
				} else if (cardType == "trick") {
					if (get.tag(card, "damage")) {
						game.playAudio("..", "extension", "十周年UI", "audio/GameShowCard");
					} else if (get.tag(card, "recover")) {
						game.playAudio("..", "extension", "十周年UI", "audio/GameShowCard");
					} else {
						game.playAudio("..", "extension", "十周年UI", "audio/GameShowCard");
					}
				} else if (cardType == "equip") {
					let equipType = get.subtype(card);
					switch (equipType) {
						case "equip1": // 武器
							game.playAudio("..", "extension", "十周年UI", "audio/weapon_equip");
							break;
						case "equip2": // 防具
							game.playAudio("..", "extension", "十周年UI", "audio/horse_equip");
							break;
						case "equip3": // -1马
							game.playAudio("..", "extension", "十周年UI", "audio/armor_equip");
							break;
						case "equip4": // +1马
							game.playAudio("..", "extension", "十周年UI", "audio/armor_equip");
							break;
						case "equip5": // 宝物
							game.playAudio("..", "extension", "十周年UI", "audio/horse_equip");
							break;
					}
				}
			},
		};
		if (!_status.connectMode) {
			game.addGlobalSkill("_useCardAudio");
		}
		if (!_status.connectMode) {
			game.addGlobalSkill("_phaseStartAudio");
		}
		// 处理按钮点击音效
		document.body.addEventListener("mousedown", function (e) {
			const target = e.target;
			if (target.closest("#dui-controls")) {
				if (target.classList.contains("control") || target.parentElement.classList.contains("control")) {
					game.playAudio("..", "extension", "十周年UI", "audio/BtnSure");
				}
			}
			if (target.classList.contains("menubutton") || target.classList.contains("button")) {
				game.playAudio("..", "extension", "十周年UI", "audio/card_click");
			}
			if (target.classList.contains("card")) {
				game.playAudio("..", "extension", "十周年UI", "audio/card_click");
			}
		});
		// 处理按钮缩放效果
		document.body.addEventListener("mousedown", function (e) {
			const control = e.target.closest(".control");
			if (control && !control.classList.contains("disabled")) {
				control.style.transform = "scale(0.95)";
				control.style.filter = "brightness(0.9)";
				setTimeout(() => {
					control.style.transform = "";
					control.style.filter = "";
				}, 100);
			}
		});
	}
});
