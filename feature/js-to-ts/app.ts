// Примітивні типи для змінних
let modalOpen: boolean = false;
const modal: HTMLElement | null = document.querySelector("#modal");
const openModalBtn: HTMLElement | null = document.querySelector("#openModal");
const closeModalBtn: HTMLElement | null = document.querySelector("#closeModal");

// Функція для відкриття модального вікна
function openModal(): void {
    if (modal) {
        modal.style.display = "block";
        modalOpen = true;
    }
}

// Функція для закриття модального вікна
function closeModal(): void {
    if (modal) {
        modal.style.display = "none";
        modalOpen = false;
    }
}

// Події на кнопках
if (openModalBtn) {
    openModalBtn.addEventListener("click", openModal);
}
if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
}

// Обробка події скролу
window.addEventListener("scroll", (): void => {
    console.log("Scrolled!");
});

// Анімація при кліку на модальне вікно
if (modal) {
    modal.addEventListener("click", (): void => {
        modal.classList.add("animate");
        setTimeout(() => {
            modal?.classList.remove("animate");
        }, 1000); // Анімація триває 1 секунду
    });
}

// Fetch даних із JSONPlaceholder та їх відображення
async function fetchPosts(): Promise<void> {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

// Відображення отриманих даних
function displayPosts(posts: any[]): void {
    const postsContainer: HTMLElement | null = document.querySelector("#posts");
    if (postsContainer) {
        postsContainer.innerHTML = posts
            .slice(0, 5) // Показати перші 5 постів
            .map(post => `
                <div class="post">
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                </div>
            `)
            .join("");
    }
}

// Виклик функції для завантаження постів
fetchPosts();
