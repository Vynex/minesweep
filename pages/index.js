import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Board from '../components/Board';

import { BiBomb, BiCog, BiTimer } from 'react-icons/bi';
import generateBoard from '../shared/lib/generateBoard';

import styles from '../shared/styles/Home.module.css';
import Settings from '../components/Settings';

const defaultDifficulty = { rows: 9, cols: 9, mines: 10 };
const defaultGameState = { isLive: false, isWon: false, isLost: false };

export default function Home() {
	const [difficulty, setDifficulty] = useState(defaultDifficulty);
	const [gameState, setGameState] = useState(defaultGameState);
	const [time, setTime] = useState(0);

	const [flags, setFlags] = useState(0);
	const [face, setFace] = useState('/assets/gameLive.svg');

	const [board, setBoard] = useState(null);

	const [settingsModal, setSettingsModal] = useState(false);

	useState(() => {
		setBoard(generateBoard(difficulty));
	}, []);

	useEffect(() => {
		let timer;

		if (gameState.isLive) {
			timer = setInterval(() => {
				setTime((t) => t + 1);
			}, 1000);
		}

		return () => clearInterval(timer);
	}, [gameState]);

	useEffect(() => {
		if (gameState.isWon) {
			setFace('/assets/gameWon.svg');
		}
		if (gameState.isLost) {
			setFace('/assets/gameLost.svg');
		}
	}, [gameState, time]);

	const handleDifficultyChange = (newDifficulty) => {
		setDifficulty(newDifficulty);
		handleGameReset();
	};

	const handleGameReset = () => {
		setFace('/assets/gameLive.svg');
		setGameState(defaultGameState);
		setTime(0);
		setFlags(0);
		setBoard(generateBoard(difficulty));
	};

	return (
		<div className={styles.body}>
			<Head>
				<title>Minesweep</title>
				<meta
					name="description"
					content="A Clean Minesweeper App built powered by Next.js and React"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className={styles.container}>
				<header className={styles.header}>
					<div className={styles.heading}>Minesweep</div>
					<div
						className={styles.button}
						onClick={() => setSettingsModal((prevState) => !prevState)}
					>
						<BiCog />
					</div>
				</header>

				<header className={styles.header}>
					<div className={styles.display}>
						<span>
							<BiTimer />
						</span>
						<span>
							{String(Math.floor(time / 60)).padStart(2, '0')}:
							{String(time % 60).padStart(2, '0')}
						</span>
					</div>

					<div className={styles.button} onClick={handleGameReset}>
						<Image
							src={face}
							alt="state"
							height={32}
							width={32}
							layout="intrinsic"
							draggable="false"
						/>
					</div>

					<div className={styles.display}>
						<span>
							<BiBomb />
						</span>
						<span>{difficulty.mines - flags}</span>
					</div>
				</header>

				<main className={styles.main}>
					<Board
						board={board}
						setBoard={setBoard}
						difficulty={difficulty}
						gameState={gameState}
						setGameState={setGameState}
						setFlags={setFlags}
						setFace={setFace}
					/>
				</main>

				<footer className={styles.footer}>
					<a
						href="https://github.com/Vynex"
						target="_blank"
						rel="noopener noreferrer"
					>
						Made with ❤️ by Kushagra
					</a>
				</footer>

				{settingsModal && (
					<Settings
						handleClose={() => setSettingsModal(false)}
						difficulty={difficulty}
						setDifficulty={handleDifficultyChange}
					/>
				)}
			</div>
		</div>
	);
}
