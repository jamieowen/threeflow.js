@set javadir="c:\program files\java\jdk1.6.0"
@set mem=1G
@%javadir%\bin\java -Xmx%mem% -server -jar sunflow.jar %*
@if %errorlevel% neq 0 pause
