on run argv
	set pageURL to item 1 of argv
	set outputPath to item 2 of argv
	set loadDelay to (item 3 of argv) as number
	set outputFolder to do shell script "dirname " & quoted form of outputPath
	set outputName to do shell script "basename " & quoted form of outputPath

	tell application "Safari"
		activate
		make new document with properties {URL:pageURL}
	end tell
	delay loadDelay

	tell application "System Events"
		tell process "Safari"
			set frontmost to true
			keystroke "p" using command down
			my waitFor(a reference to sheet 1 of window 1)
			set printSheet to sheet 1 of window 1
			click menu button "PDF" of printSheet
			my waitFor(a reference to menu item "Save as PDF" of menu 1 of menu button "PDF" of printSheet)
			click menu item "Save as PDF" of menu 1 of menu button "PDF" of printSheet
			my waitFor(a reference to text field 1 of sheet 1 of window 1)
			delay 1
			keystroke "a" using command down
			keystroke outputName
			keystroke "g" using {command down, shift down}
			delay 1
			keystroke outputFolder
			keystroke return
			delay 1
			keystroke return
		end tell
	end tell

	repeat 120 times
		if (do shell script "test -s " & quoted form of outputPath & " && echo yes || echo no") is "yes" then exit repeat
		delay 0.5
	end repeat
	delay 1

	tell application "Safari" to close document 1
end run

on waitFor(target)
	repeat 60 times
		tell application "System Events"
			if exists target then return
		end tell
		delay 0.5
	end repeat
	error "timeout"
end waitFor
