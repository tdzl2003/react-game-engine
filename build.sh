mkdir build
mkdir build/examples

for NAME in 1-blank 2-sprites 3-animates 4-touches
do
    mkdir build/examples/$NAME
    cp examples/$NAME/index.release.html build/examples/$NAME/index.html
    react-native bundle --entry-file examples/$NAME/launch.js --platform web --dev false --bundle-output build/examples/$NAME/launch.bundle.js --assets-dest build
    react-native bundle --entry-file examples/$NAME/index.js --platform web --dev false --bundle-output build/examples/$NAME/index.bundle.js --assets-dest build
done
