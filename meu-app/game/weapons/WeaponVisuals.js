export function createWeaponModel() {
    const gunGroup = new THREE.Group();
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.22, 0.75),
        new THREE.MeshLambertMaterial({ color: 0x1a1a1a })
    );
    gunGroup.add(body);

    const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.65, 8),
        new THREE.MeshStandardMaterial({ color: 0x0d0d0d, metalness: 0.8, roughness: 0.2 })
    );
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.05, -0.55);
    gunGroup.add(barrel);

    const magazine = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.28, 0.18),
        new THREE.MeshLambertMaterial({ color: 0x991b1b })
    );
    magazine.position.set(0, -0.16, -0.1);
    gunGroup.add(magazine);

    const sight = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.06, 0.08),
        new THREE.MeshBasicMaterial({ color: 0xeab308 })
    );
    sight.position.set(0, 0.14, -0.3);
    gunGroup.add(sight);

    const muzzleFlashLight = new THREE.PointLight(0xffb700, 0, 5);
    muzzleFlashLight.position.set(0, 0.05, -0.9);
    gunGroup.add(muzzleFlashLight);

    gunGroup.position.set(0.28, -0.24, -0.5);
    return { model: gunGroup, muzzleFlashLight };
}

function createIconSprite(icon) {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext("2d");
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "84px sans-serif";
    context.fillText(icon, 64, 70);

    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(canvas),
        transparent: true,
        fog: false
    }));
    sprite.scale.set(1.1, 1.1, 1);
    return sprite;
}

export function createAmmoPickupMesh(weapon) {
    const group = new THREE.Group();
    group.add(new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.45, 0.45),
        new THREE.MeshStandardMaterial({ color: 0x3f3f46, metalness: 0.4, roughness: 0.6 })
    ));
    group.add(new THREE.Mesh(
        new THREE.BoxGeometry(0.74, 0.14, 0.49),
        new THREE.MeshStandardMaterial({ color: weapon.ac, emissive: weapon.ac, emissiveIntensity: 0.9 })
    ));
    const sprite = createIconSprite(weapon.icon);
    sprite.position.y = 0.95;
    group.add(sprite);
    return group;
}
