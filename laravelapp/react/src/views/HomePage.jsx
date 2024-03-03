import * as React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const styles = {
    root: {
        position: 'relative',
        height: '100vh',
        backgroundImage: `url('/images/1.jpg')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        display: 'fl</Typography>ex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: '16px',
        color: '#fff',
        textAlign: 'center',
        width: "50%"
    },
    description: {
        fontSize: '1.5rem',
        marginBottom: '16px',
        color: '#fff',
        textAlign: 'center',
        width: "50%"
    },
    link: {
        marginTop: '16px',
    },
};

function Banner({ post }) {
    return (
        <div style={styles.root}>
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="h4" component="h1" style={styles.title}>
                    {post.title}
                </Typography>
                <Typography variant="body1" style={styles.description}>
                    {post.description}
                </Typography>
                <Button variant="contained" color="primary" href="/catalogue" style={{ ...styles.link, width: '200px' }}>
                    {post.linkText}
                </Button>
            </div>
        </div>
    );
}


export default function Home() {
    const banner = {
        title: 'Добро пожаловать!',
        description:
            'Это домашняя работа по НИСу. Автор: Карапетян Артём, студент 2 курса ФКН ПИ. Сделана с использованием JavaScript, React, Materila UI, Axios, PHP, Laravel, Vite, MySQL.',
        linkText: 'Перейти в Каталог',
    };

    return (
        <div style={styles.root}>
            <Banner post={banner} />
        </div>
    );
}
